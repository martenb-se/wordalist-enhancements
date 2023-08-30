import {useContext} from "preact/compat";
import {useEffect, useState} from "preact/hooks";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor, SensorDescriptor, SensorOptions,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  CustomSelectionsExercisesStorageSetterType,
  CustomSelectionsExercisesStorageType,
  CustomSelectionsOneExerciseStorageType,
  MultipleCustomSelectionsExercisesStorageSetterType,
  SectionSelectionContextType
} from "../../../../@types/customSelectionTypes";
import {SectionSelectionContext} from "../../../../hooks/sectionSelectionContext";
import {SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {restrictToVerticalAxis, restrictToWindowEdges} from "@dnd-kit/modifiers";
import {getHandleDragEndFunction} from "../../../../util/dndUtil";
import {propFilterExerciseID} from "../../../../util/customSelectionHandling";
import {SortableExercise} from "../SortableExercise";
import {SortableCustomSelectionsCollection} from "../SortableCustomSelectionsCollection";

/**
 * Type representing the mapping between a sortable item id and an exercise ID.
 */
type IdToExerciseIdMappingType = {
  id: number,
  exerciseID: string
}

/**
 * Type representing a sortable exercise.
 */
type SortableExerciseType = {
  id: number,
  customSelectionsExercises: CustomSelectionsOneExerciseStorageType
}

/**
 * Component for displaying a collection of sortable exercises.
 *
 * @returns JSX element representing the sortable exercises collection.
 */
export const SortableExercisesCollection = () => {
  const sectionSelectionContext: SectionSelectionContextType = useContext(SectionSelectionContext);

  // Set id to exerciseID mapping once
  const [itemsID,] =
    useState<IdToExerciseIdMappingType[]>(
      sectionSelectionContext.customSelectionsExercisesStorage.map(
        (oneCustomSelectionsExercise: CustomSelectionsOneExerciseStorageType, index: number):
        IdToExerciseIdMappingType => {
          return {id: index + 1, exerciseID: oneCustomSelectionsExercise.exerciseID}
        }));

  // Sortable
  const [items, setItems] =
    useState<SortableExerciseType[]>(
      sectionSelectionContext.customSelectionsExercisesStorage.map(
        (oneCustomSelectionsExercise: CustomSelectionsOneExerciseStorageType, index: number):
        SortableExerciseType => {
          return {id: index + 1, customSelectionsExercises: oneCustomSelectionsExercise}
        }));

  const sensors: SensorDescriptor<SensorOptions>[] = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Filters custom selections that have unchanged indices in the storage.
   *
   * @param selectionsStorage - The storage of custom selections.
   * @returns A function that filters custom selections based on unchanged indices.
   */
  function unchangedItemsIndicesFilter(selectionsStorage: CustomSelectionsExercisesStorageType):
    (filterProp: { customSelectionsExercises: CustomSelectionsOneExerciseStorageType }, index: number) => boolean {
    return ({customSelectionsExercises}: { customSelectionsExercises: CustomSelectionsOneExerciseStorageType },
            index: number):
      boolean => customSelectionsExercises.index === selectionsStorage[index]?.index
  }

  /**
   * Updates the order of custom selections in the storage if their indices have changed due to sorting.
   */
  useEffect(() => {
    // Skip if order is unchanged
    if (items.filter(
      unchangedItemsIndicesFilter(sectionSelectionContext.customSelectionsExercisesStorage)).length === items.length) {
      return;
    }

    // Check which indices differ
    const customSelectionsExercisesToModify: CustomSelectionsExercisesStorageSetterType[] = [];
    items.forEach(({customSelectionsExercises}, itemsIndex) => {
      if (customSelectionsExercises.index !==
        sectionSelectionContext.customSelectionsExercisesStorage[itemsIndex].index) {
        // What is customSelectionsExercises.index should now have what's at
        // sectionSelectionContext.customSelectionsExercisesStorage[itemsIndex].index
        const onModifiedIndexDeepCopy =
          JSON.parse(JSON.stringify(
            sectionSelectionContext.customSelectionsExercisesStorage.filter(
              (filterProps: CustomSelectionsOneExerciseStorageType): boolean =>
                filterProps.index === customSelectionsExercises.index)[0]));

        onModifiedIndexDeepCopy.index = sectionSelectionContext.customSelectionsExercisesStorage[itemsIndex].index;
        customSelectionsExercisesToModify.push(onModifiedIndexDeepCopy)

      }
    });

    if (customSelectionsExercisesToModify.length > 0) {
      // Update exercises that no longer match against the original storage
      sectionSelectionContext.setMultipleInCustomSelectionsExercisesStorage(
        {
          customSelectionsExercisesStorageSetters: customSelectionsExercisesToModify
        } as MultipleCustomSelectionsExercisesStorageSetterType);
    }

  }, [items]);

  /**
   * Updates the list of sortable items when custom selections storage changes.
   */
  useEffect(() => {
    // Update items to contain new indices
    setItems(sectionSelectionContext.customSelectionsExercisesStorage.map(
      (oneCustomSelectionsExercise: CustomSelectionsOneExerciseStorageType, index: number):
      { id: number, customSelectionsExercises: CustomSelectionsOneExerciseStorageType } => {

        // Keep old id used for sorting
        const itemIdMatch: { id: number, exerciseID: string }[] =
          itemsID.filter(propFilterExerciseID(oneCustomSelectionsExercise.exerciseID));
        const itemId: number = itemIdMatch ? itemIdMatch[0].id : index + 1;

        return {id: itemId, customSelectionsExercises: oneCustomSelectionsExercise}
      }));

  }, [sectionSelectionContext.customSelectionsExercisesStorage]);

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={getHandleDragEndFunction<SortableExerciseType>(setItems)}>
      <ul className="SortableExercisesCollection">
        <SortableContext
          items={items}
          strategy={verticalListSortingStrategy}>
          {items.map(
            ({id, customSelectionsExercises}:
               { id: number, customSelectionsExercises: CustomSelectionsOneExerciseStorageType }) => (
              <SortableExercise key={id} id={id} customSelectionsExercises={customSelectionsExercises}>
                <SortableCustomSelectionsCollection exerciseID={customSelectionsExercises.exerciseID}/>
              </SortableExercise>))}
        </SortableContext>
      </ul>
    </DndContext>
  );
}
