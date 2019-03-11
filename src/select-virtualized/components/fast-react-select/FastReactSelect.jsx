import React, { forwardRef, memo, Fragment, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactSelect, { Async as ReactAsync } from 'react-select';
import { calculateDebounce, mapLowercaseLabel } from './helpers/fast-react-select';
import { calculateTotalListSize } from '../grouped-virtualized-list/helpers/grouped-list';
import { optionsPropTypes } from '../../helpers/prop-types';
import { buildListComponents } from '../../helpers/select';

const LAG_INDICATOR = 1000;

const loadingMessage = () => <div>...</div>;

let FastReactSelect = (props, ref) => {
  const listSize = useMemo(() => (props.grouped && calculateTotalListSize(props.options)) || props.options.length, [
    props.options.length,
  ]);

  const [inputState, setInputState] = useState(undefined);

  // avoid destructuring to best performance
  const memoOptions = useMemo(
    () => {
      return mapLowercaseLabel(props.options, props.formatOptionLabel, (itemOption) => {
        if (itemOption.options && props.grouped) {
          return {
            options: mapLowercaseLabel(itemOption.options, props.formatOptionLabel),
          };
        }
        return {};
      });
    },
    [props.options],
  );

  const onInputChange = useCallback((inputValue) => {
    setInputState(inputValue.toLowerCase());
  });

  const extendedComponents = {
    ...props.components,
    ...buildListComponents({
      ...props,
      input: inputState,
    }),
  };

  return (
    <Fragment>
      {listSize <= LAG_INDICATOR && <ReactSelect ref={ref} {...props} components={extendedComponents} />}
      {listSize > LAG_INDICATOR && (
        <ReactAsync
          ref={ref}
          {...props}
          loadingMessage={props.loadingMessage || loadingMessage}
          cacheOptions
          defaultOptions={memoOptions}
          onInputChange={onInputChange}
          components={extendedComponents}
        />
      )}
    </Fragment>
  );
};

FastReactSelect = forwardRef(FastReactSelect);
FastReactSelect = memo(FastReactSelect);

FastReactSelect.propTypes = {
  onCalculateFilterDebounce: PropTypes.func,
  options: optionsPropTypes.isRequired,
};

FastReactSelect.defaultProps = {
  onCalculateFilterDebounce: calculateDebounce,
};

export default FastReactSelect;
