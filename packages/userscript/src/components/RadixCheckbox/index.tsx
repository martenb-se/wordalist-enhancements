import {CustomSelectionType} from "../../@types/customSelectionTypes";
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';
import './styles.css';

/**
 * Radix Checkbox component for handling a custom selection's section.
 *
 * @param props - The properties for the RadixCheckbox component.
 */
const RadixCheckbox = (props : {
  id: string,
  exerciseID: string,
  sectionID: string,
  exerciseTitle: string,
  sectionTitle: string,
  onChangeCallback: (
    checked: boolean,
    {elementID, exerciseID, sectionID, exerciseTitle, sectionTitle}
      : CustomSelectionType) => void,
  label: string,
  checked: boolean
}) => (
  <form className="CheckboxForm">
    <label className="Label" htmlFor={props.id}>{props.label}</label>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Checkbox.Root
        className="CheckboxRoot"
        checked={props.checked}
        id={props.id}
        onCheckedChange={(checked: boolean) => {
          props.onChangeCallback(checked, {
            elementID: props.id,
            exerciseID: props.exerciseID,
            sectionID: props.sectionID,
            exerciseTitle: props.exerciseTitle,
            sectionTitle: props.sectionTitle
          });
        }}>
        <Checkbox.Indicator className="CheckboxIndicator">
          <CheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
    </div>
  </form>
);

export default RadixCheckbox;
