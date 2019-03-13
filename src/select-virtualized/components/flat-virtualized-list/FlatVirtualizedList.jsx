import { List, InfiniteLoader } from 'react-virtualized';
import React, { useEffect, memo, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getListHeight, getScrollIndex, getNextRowIndex } from '../../helpers/getters';
import { flatVirtualizedListRowRenderer, updateListWithNextBatchFromIndex } from './helpers/flat-list.jsx';

let FlatListVirtualized = (props) => {
  let queueScrollToIdx = undefined;
  let listComponent;

  const [focusedItemIndex, setFocusedItemIndex] = useState(undefined);

  useEffect(() => {
    // only scroll to index when we have something in the queue of focused and not visible
    if (listComponent && queueScrollToIdx !== undefined && focusedItemIndex !== undefined) {
      listComponent.current.scrollToRow(getNextRowIndex(focusedItemIndex, queueScrollToIdx, props.options));
      queueScrollToIdx = undefined;
    }
  });

  const onOptionFocused = useCallback(({ index, isVisible }) => {
    if (index !== undefined && focusedItemIndex !== index && isVisible) {
      setFocusedItemIndex(index);
    } else if (index !== undefined && !isVisible && !queueScrollToIdx) {
      queueScrollToIdx = index;
    }
  });

  const scrollToIndex = useMemo(
    () =>
      getScrollIndex({
        children: props.options,
        selected: props.selectedValue || props.defaultValue,
        valueGetter: props.valueGetter,
      }),
    [props.options, props.selectedValue, props.defaultValue],
  );

  const list = [];
  updateListWithNextBatchFromIndex(list, { ...props, startIndex: 0 });

  const isRowLoaded = useCallback(({ index }) => {
    return !!list[index];
  });

  let rowRenderer = flatVirtualizedListRowRenderer({
    ...props,
    onOptionFocused: onOptionFocused,
    list,
  });

  const loadMoreRows = useCallback(({ startIndex }) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // this function will update internally the list, it is a side effect for best performance
        updateListWithNextBatchFromIndex(list, { ...props, startIndex });
        resolve(list);
      }, 100);
    });
  });

  const height = getListHeight({
    maxHeight: props.maxHeight,
    totalSize: list.length,
    optionHeight: props.optionHeight,
  });

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      threshold={props.threshold}
      loadMoreRows={loadMoreRows}
      rowCount={props.children.length}
      minimumBatchSize={props.minimumBatchSize}
    >
      {({ onRowsRendered, registerChild }) => {
        return (
          <List
            ref={(element) => {
              registerChild(element);
              listComponent = {
                current: element,
              };
              return element;
            }}
            onRowsRendered={onRowsRendered}
            style={{ width: '100%' }}
            height={height}
            scrollToIndex={scrollToIndex}
            rowCount={list.length}
            rowHeight={props.optionHeight}
            rowRenderer={rowRenderer}
            width={props.maxWidth}
          />
        );
      }}
    </InfiniteLoader>
  );
};

FlatListVirtualized = memo(FlatListVirtualized);

FlatListVirtualized.propTypes = {
  maxHeight: PropTypes.number, // this prop is coming from react-select
  maxWidth: PropTypes.number, // the style width 100% will override this prop, we need to set something big because it is a required field
  children: PropTypes.node.isRequired,
  optionHeight: PropTypes.number,
  selectedValue: PropTypes.object,
  defaultValue: PropTypes.object,
  valueGetter: PropTypes.func,
  options: PropTypes.array.isRequired,
  minimumBatchSize: PropTypes.number,
  threshold: PropTypes.number,
};

FlatListVirtualized.defaultProps = {
  valueGetter: (item) => item && item.value,
  maxWidth: 500,
  maxHeight: 200,
  minimumBatchSize: 300,
  threshold: 100,
};

FlatListVirtualized.displayName = 'FlatListVirtualized';

export default FlatListVirtualized;
