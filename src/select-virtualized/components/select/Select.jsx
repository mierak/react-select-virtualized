import { FastReactSelect } from '../../shared-components/fast-react-select';
import PropTypes from 'prop-types';
import React, { useRef, useImperativeHandle, useState, forwardRef, useMemo, memo, useCallback } from 'react';
import './styles.css';
import { buildListComponents, getStyles } from '../../shared-helpers/select';
import { defaultGroupFormat } from '../../shared-components/grouped-virtualized-list/helpers/grouped-list.jsx';
import 'react-virtualized/styles.css';
import { optionsPropTypes } from '../../shared-helpers/prop-types';

const throwMixControlledError = () => {
  throw new Error(
    `react-select-virtualize do not support using defaultValue and value at the same time. Choose between uncontrolled or controlled component.
    Clear and Select component methods can only be used with uncontrolled components.`,
  );
};

let Select = (props, ref) => {
  const reactSelect = useRef('react-select');

  const { grouped, formatGroupHeaderLabel, groupHeaderHeight, onChange, defaultValue, value, optionHeight } = props;

  if (defaultValue && value) {
    throwMixControlledError();
  }

  const [selection, setSelection] = useState(defaultValue);

  const defaultProps = {
    isMulti: false,
    isClearable: true,
    isDisabled: false,
    className: `react-select-virtualized`,
    isSearchable: true,
    blurInputOnSelect: true,
  };

  const memoGroupHeaderOptions = useMemo(() => {
    if (!grouped && !formatGroupHeaderLabel && !groupHeaderHeight) return { formatGroupHeaderLabel: false };

    const groupHeaderHeightValue = groupHeaderHeight || optionHeight;
    return {
      groupHeaderHeight: groupHeaderHeightValue,
      formatGroupHeaderLabel: formatGroupHeaderLabel || defaultGroupFormat(groupHeaderHeightValue),
    };
  }, [grouped, formatGroupHeaderLabel, groupHeaderHeight, optionHeight]);

  const onChangeHandler = useCallback(
    (valueChanged, { action }) => {
      if (onChange) {
        onChange(valueChanged, { action });
      }
      setSelection(valueChanged);
    },
    [onChange, setSelection],
  );

  useImperativeHandle(ref, () => ({
    clear: () => {
      if (value) {
        throwMixControlledError();
      }
      setSelection(null);
    },
    focus: () => {
      reactSelect.current.focus();
    },
    select: (item) => {
      if (value) {
        throwMixControlledError();
      }
      setSelection(item);
    },
  }));

  return (
    <FastReactSelect
      ref={reactSelect}
      {...defaultProps}
      {...props}
      styles={{ ...getStyles(), ...props.styles }} //  keep react-select styles implementation and pass to any customization done
      value={value || selection}
      onChange={onChangeHandler}
      options={props.options}
      components={{
        ...props.components,
        ...buildListComponents({
          ...props,
          ...memoGroupHeaderOptions,
        }),
      }} // props.components comes from react-select if present
    />
  );
};

Select = forwardRef(Select);

Select = memo(Select);

Select.propTypes = {
  ...FastReactSelect.propTypes,
  options: optionsPropTypes.isRequired,
  onChange: PropTypes.func,
  grouped: PropTypes.bool, // this is only for performance enhancement so we do not need to iterate in the array many times. It is not needed if formatGroupHeaderLabel or groupHeaderHeight are defined
  formatGroupHeaderLabel: PropTypes.func,
  optionHeight: PropTypes.number,
  groupHeaderHeight: PropTypes.number,
  defaultValue: PropTypes.object,
};

Select.defaultProps = {
  grouped: false,
  optionHeight: 31,
};

Select.displayName = 'Select';

export default Select;
