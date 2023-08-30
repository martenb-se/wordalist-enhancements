import {useContext} from "preact/compat";
import {useEffect, useState} from "preact/hooks";
import {JSX} from "preact";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor, SensorDescriptor, SensorOptions,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {SectionSelectionContext} from "../../../../hooks/sectionSelectionContext";
import {
  CustomSelectionSectionsType,
  OneCustomSelectionSectionType,
  CustomSelectionsSectionStorageSetterType,
  SectionSelectionContextType
} from "../../../../@types/customSelectionTypes";
import {SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {restrictToVerticalAxis, restrictToWindowEdges} from "@dnd-kit/modifiers";
import {SortableSection} from "../SortableSection";
import {getHandleDragEndFunction} from "../../../../util/dndUtil";

/**
 * Type representing the mapping between a sortable item id and a section ID.
 */
type IdToSectionIdMappingType = {
  id: number,
  sectionID: string
}

/**
 * Type representing a sortable section.
 */
type SortableSectionType = {
  id: number,
  section: OneCustomSelectionSectionType
}

export const SortableSectionsCollection = (props: {
  hash: string,
  sections: CustomSelectionSectionsType,
  children?: string | JSX.Element | JSX.Element[] | (() => JSX.Element)
}) => {
  const sectionSelectionContext: SectionSelectionContextType = useContext(SectionSelectionContext);

  // Set id to sectionID mapping once
  const [itemsID,] =
    useState<IdToSectionIdMappingType[]>(
      props.sections.map(
        ({sectionID}, index: number):
        IdToSectionIdMappingType => {
          return {id: index + 1, sectionID}
        }));

  // Sortable
  const [items, setItems] =
    useState<SortableSectionType[]>(
      props.sections.map(
        (section, index: number):
        SortableSectionType => {
          return {id: index + 1, section}
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
  function unchangedItemsIndicesFilter(selectionsStorage: CustomSelectionSectionsType):
    (filterProp: { section: OneCustomSelectionSectionType }, index: number) => boolean {
    return ({section}: { section: OneCustomSelectionSectionType },
            index: number):
      boolean => section.index === selectionsStorage[index]?.index
  }

  /**
   * Updates the order of custom selections in the storage if their indices have changed due to sorting.
   */
  useEffect(() => {
    // Skip if order is unchanged
    if (items.filter(
      unchangedItemsIndicesFilter(props.sections)).length === items.length) {
      return;
    }

    // Check which indices differ
    const customSectionsToModify: CustomSelectionsSectionStorageSetterType[] = [];
    items.forEach(({section}, itemsIndex) => {
      if (section.index !== props.sections[itemsIndex].index) {
        // What is customSelectionStorage.index should now have what's at filteredStorage[itemsIndex].index
        const onModifiedIndexDeepCopy: OneCustomSelectionSectionType =
          JSON.parse(JSON.stringify(
            props.sections.filter(
              (filterProps) => filterProps.index === section.index)[0]));

        onModifiedIndexDeepCopy.index = props.sections[itemsIndex].index;

        customSectionsToModify.push({
          ...onModifiedIndexDeepCopy,
          hash: props.hash
        });

      }
    });

    if (customSectionsToModify.length > 0) {
      sectionSelectionContext.setMultipleInCustomSelectionSectionsStorage(customSectionsToModify);
    }

  }, [items]);

  /**
   * Updates the list of sortable items when sections storage changes.
   */
  useEffect(() => {
    // Update items to contain new indices
    setItems(props.sections.map(
      (oneCustomSelectionSection: OneCustomSelectionSectionType, index: number):
      SortableSectionType => {

        // Keep old id used for sorting
        const itemIdMatch = itemsID.filter(
          ({sectionID}) => sectionID === oneCustomSelectionSection.sectionID);
        const itemId: number = itemIdMatch && itemIdMatch.length > 0 ? itemIdMatch[0].id : index + 1;

        return {id: itemId, section: oneCustomSelectionSection}
      }));

  }, [props.sections]);

  return (
    <DndContext
      modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={getHandleDragEndFunction<SortableSectionType>(setItems)}>
      <ul className="SortableSectionsCollection">
        <SortableContext
          items={items}
          strategy={verticalListSortingStrategy}>
          {items.map(
            ({id, section}: SortableSectionType) => (
              <SortableSection key={id} id={id} section={section} hash={props.hash}/>))}
        </SortableContext>
      </ul>
    </DndContext>
  );
}
