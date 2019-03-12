import React, { forwardRef, memo, Fragment, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import ReactSelect, { Async as ReactAsync } from 'react-select';
import { calculateDebounce, mapLowercaseLabel, buildListComponents } from './helpers/fast-react-select';
import { calculateTotalListSize } from '../grouped-virtualized-list/helpers/grouped-list';

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

  const needAsync = listSize > LAG_INDICATOR;

  const extendedComponents = useMemo(
    () => ({
      ...props.components,
      ...buildListComponents({
        ...props,
        input: inputState,
      }),
    }),
    [inputState],
  );

  let timer;
  const loadOptions = useCallback((input, callback) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      callback(memoOptions);
    }, 100);
  });

  return (
    <Fragment>
      {!needAsync && <ReactSelect ref={ref} {...props} components={extendedComponents} />}
      {needAsync && (
        <ReactAsync
          ref={ref}
          {...props}
          loadingMessage={props.loadingMessage || loadingMessage}
          cacheOptions
          defaultOptions={memoOptions}
          loadOptions={loadOptions}
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
  options: PropTypes.array.isRequired,
};

FastReactSelect.defaultProps = {
  onCalculateFilterDebounce: calculateDebounce,
};

export default FastReactSelect;
