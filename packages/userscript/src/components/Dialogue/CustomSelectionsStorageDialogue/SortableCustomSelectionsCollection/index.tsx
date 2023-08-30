import {useContext} from "preact/compat";
import {useEffect, useState} from "preact/hooks";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  SensorDescriptor,
  SensorOptions,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {JSX} from "preact";
import {
  CustomSelectionsStorageSetterType, CustomSelectionsStorageType,
  MultipleCustomSelectionsStorageSetterType,
  OneCustomSelectionStorageType,
  SectionSelectionContextType
} from "../../../../@types/customSelectionTypes";
import {SectionSelectionContext} from "../../../../hooks/sectionSelectionContext";
import {SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {restrictToVerticalAxis, restrictToWindowEdges} from "@dnd-kit/modifiers";
import {
  getTitleFromExerciseID,
  propFilterCustomSelectionHash,
  propFilterExerciseID,
  sectionsMapperRestoreElementIDs
} from "../../../../util/customSelectionHandling";
import {SortableCustomSelection} from "../SortableCustomSelection";
import {getHandleDragEndFunction} from "../../../../util/dndUtil";

/**
 * Type representing the mapping between a sortable item id and custom selection hash.
 */
type IdToHashMappingType = {
  id: number,
  hash: string
}

/**
 * Type representing a sortable custom selection.
 */
type SortableCustomSelectionType = {
  id: number,
  customSelectionStorage: OneCustomSelectionStorageType
}

/**
 * Renders a collection of sortable custom selections for a specified exercise.
 *
 * @param props - Component props.
 * @returns A JSX element representing the sortable custom selections' collection.
 */
export const SortableCustomSelectionsCollection = (props: {
  exerciseID: string,
  children?: string | JSX.Element | JSX.Element[] | (() => JSX.Element)
}): JSX.Element => {
  const sectionSelectionContext: SectionSelectionContextType = useContext(SectionSelectionContext);

  // Set id to hash mapping once
  const [itemsID,] =
    useState<IdToHashMappingType[]>(
      sectionSelectionContext.customSelectionsStorage.filter(propFilterExerciseID(props.exerciseID)).map(
        (oneCustomSelectionStorage: OneCustomSelectionStorageType, index: number):
        IdToHashMappingType => {
          return {id: index + 1, hash: oneCustomSelectionStorage.hash}
        }));

  // Sortable
  const [items, setItems] =
    useState<SortableCustomSelectionType[]>(
      sectionSelectionContext.customSelectionsStorage.filter(propFilterExerciseID(props.exerciseID)).map(
        (oneCustomSelectionStorage: OneCustomSelectionStorageType, index: number):
        SortableCustomSelectionType => {
          return {id: index + 1, customSelectionStorage: oneCustomSelectionStorage}
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
  function unchangedItemsIndicesFilter(selectionsStorage: CustomSelectionsStorageType):
    (filterProp: { customSelectionStorage: OneCustomSelectionStorageType }, index: number) => boolean {
    return ({customSelectionStorage}: { customSelectionStorage: OneCustomSelectionStorageType }, index: number):
      boolean => customSelectionStorage.index === selectionsStorage[index]?.index
  }

  /**
   * Updates the order of custom selections in the storage if their indices have changed due to sorting.
   */
  useEffect(() => {
    const filteredStorage: CustomSelectionsStorageType =
      sectionSelectionContext.customSelectionsStorage.filter(propFilterExerciseID(props.exerciseID));

    // Skip if order is unchanged
    if (items.filter(unchangedItemsIndicesFilter(filteredStorage)).length === items.length) {
      return;
    }

    // Check which indices differ
    const customSelectionsToModify: CustomSelectionsStorageSetterType[] = [];
    items.forEach(({customSelectionStorage}, itemsIndex) => {
      if (customSelectionStorage.index !== filteredStorage[itemsIndex].index) {
        // What is at customSelectionStorage.index should now have what's at filteredStorage[itemsIndex].index
        const onModifiedIndexDeepCopy =
          JSON.parse(JSON.stringify(
            filteredStorage.filter((filterProps: OneCustomSelectionStorageType): boolean =>
              filterProps.index === customSelectionStorage.index)[0]));

        onModifiedIndexDeepCopy.index = filteredStorage[itemsIndex].index;

        customSelectionsToModify.push({
          ...onModifiedIndexDeepCopy,
          exerciseTitle: getTitleFromExerciseID({
            exerciseID: onModifiedIndexDeepCopy.exerciseID,
            sectionSelectionContext
          }),
          sections:
            onModifiedIndexDeepCopy.sections.map(sectionsMapperRestoreElementIDs(customSelectionStorage.exerciseID)),
        })

      }
    });

    if (customSelectionsToModify.length > 0) {
      sectionSelectionContext.setMultipleInCustomSelectionsStorage(
        {customSelectionsStorageSetters: customSelectionsToModify} as MultipleCustomSelectionsStorageSetterType
      );
    }

  }, [items]);

  /**
   * Updates the list of sortable items when custom selections storage changes.
   */
  useEffect(() => {
    // Update items to contain new indices
    setItems(sectionSelectionContext.customSelectionsStorage.filter(propFilterExerciseID(props.exerciseID)).map(
      (oneCustomSelectionStorage: OneCustomSelectionStorageType, index: number):
      { id: number, customSelectionStorage: OneCustomSelectionStorageType } => {

        // Keep old id used for sorting
        const itemIdMatch: { id: number, hash: string }[] =
          itemsID.filter(propFilterCustomSelectionHash(oneCustomSelectionStorage.hash));
        const itemId: number = itemIdMatch && itemIdMatch.length > 0 ? itemIdMatch[0].id : index + 1;

        return {id: itemId, customSelectionStorage: oneCustomSelectionStorage}
      }));

  }, [sectionSelectionContext.customSelectionsStorage]);

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={getHandleDragEndFunction<SortableCustomSelectionType>(setItems)}>
      <ul className="SortableCustomSelectionsCollection">
        <SortableContext
          items={items}
          strategy={verticalListSortingStrategy}>
          {items.map(
            ({id, customSelectionStorage}:
               { id: number, customSelectionStorage: OneCustomSelectionStorageType }) => (
              <SortableCustomSelection key={id} id={id} customSelectionStorage={customSelectionStorage}/>))}
        </SortableContext>
      </ul>
    </DndContext>
  );
}
