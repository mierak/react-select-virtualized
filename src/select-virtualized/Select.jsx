import { FastReactSelect } from './components/fast-react-select';
import PropTypes from 'prop-types';
import React, { useRef, useImperativeHandle, useState, forwardRef, useMemo, memo, useCallback } from 'react';
import './styles.css';
import { getStyles } from './helpers/select';
import { defaultGroupFormat } from './components/grouped-virtualized-list/helpers/grouped-list.jsx';
import 'react-virtualized/styles.css';
import { optionsPropTypes } from './helpers/prop-types';

let Select = (props, ref) => {
  const reactSelect = useRef('react-select');

  const [selection, setSelection] = useState(props.defaultValue);

  const defaultProps = {
    isMulti: false,
    isClearable: true,
    isDisabled: false,
    className: `react-select-virtualized`,
    isSearchable: true,
    blurInputOnSelect: true,
  };

  const { groupHeaderHeight, formatGroupHeaderLabel } = useMemo(
    () => {
      if (!props.grouped && !props.formatGroupHeaderLabel && !props.groupHeaderHeight)
        return { formatGroupHeaderLabel: false };

      const groupHeaderHeight = props.groupHeaderHeight || props.optionHeight;
      return {
        groupHeaderHeight,
        formatGroupHeaderLabel: props.formatGroupHeaderLabel || defaultGroupFormat(groupHeaderHeight),
      };
    },
    [props.grouped, props.formatGroupHeaderLabel, props.groupHeaderHeight],
  );

  const onChangeHandler = useCallback((value, { action }) => {
    if (props.onChange) {
      props.onChange(value, { action });
    }
    setSelection(value);
  });

  useImperativeHandle(ref, () => ({
    clear: () => {
      setSelection(null);
    },
    focus: () => {
      reactSelect.current.focus();
    },
    select: (item) => setSelection(item),
  }));

  console.log('re rendering select');

  return (
    <FastReactSelect
      ref={reactSelect}
      {...defaultProps}
      {...props}
      styles={{ ...getStyles(), ...props.styles }} // keep react-select styles implementation and pass to any customization done
      value={selection}
      onChange={onChangeHandler}
      options={props.options}
      groupHeaderHeight={groupHeaderHeight}
      formatGroupHeaderLabel={formatGroupHeaderLabel}
      // props.components comes from react-select if present
    />
  );
};

Select = forwardRef(Select);

Select = memo(Select);

Select.propTypes = {
  ...FastReactSelect.propTypes,
  options: optionsPropTypes.isRequired,
  onChange: PropTypes.func,
  onCalculateFilterDebounce: PropTypes.func,
  grouped: PropTypes.bool, // this is only for performance enhancement so we do not need to iterate in the array many times. It is not needed if formatGroupHeaderLabel or groupHeaderHeight are defined
  formatGroupHeaderLabel: PropTypes.func,
  optionHeight: PropTypes.number,
  groupHeaderHeight: PropTypes.number,
  defaultValue: PropTypes.object,
};

Select.defaultProps = {
  grouped: false,
  optionHeight: 31,
  onCalculateFilterDebounce: undefined,
};

Select.displayName = 'Select';

export default Select;
