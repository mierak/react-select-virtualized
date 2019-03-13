import React from 'react';

import { FastOption } from '../../fast-option';

export const flatVirtualizedListRowRenderer = ({ list, onOptionFocused, optionHeight, formatOptionLabel }) => ({
  key,
  index,
  style,
  isVisible,
  isScrolling,
}) => {
  console.log('list' + list && list.length);
  console.log('index' + index);
  const thisProps = list[index].props;

  if (thisProps.isFocused && !isScrolling) {
    onOptionFocused({ data: thisProps.data, index, isVisible, isScrolling });
  }

  return (
    <div className="flat-virtualized-item" key={key} style={style}>
      <FastOption
        data={thisProps.data}
        setValue={thisProps.setValue}
        isVisible={isVisible}
        isScrolling={isScrolling}
        optionHeight={optionHeight}
        isFocused={thisProps.isFocused}
        formatOptionLabel={formatOptionLabel}
      />
    </div>
  );
};

// I know it is a side effect but we will update the list ref here, so if we have a very big array
// we do not have to over iterate and consume space creating each time a new one
export const updateListWithNextBatchFromIndex = (list, { startIndex, inputValue, children, minimumBatchSize }) => {
  if (!list.length || (minimumBatchSize && Number.isInteger(list.length / minimumBatchSize))) {
    const fromIndex = startIndex === 0 ? list.length : startIndex;
    const result = [];
    for (let i = fromIndex; i < list.length + minimumBatchSize; i++) {
      if (
        (inputValue !== '' &&
          children[i] &&
          children[i].props.data &&
          children[i].props.data.lowercaseLabel &&
          children[i].props.data.lowercaseLabel.includes(inputValue)) ||
        inputValue === ''
      ) {
        result.push(children[i]);
      }
    }

    // HERE WE HAVE THE SIDE EFFECT, IT IS AN ANTI PATTERN BUT EFFICIENT IN THIS CASE
    list.push(...result);
    return list;
  }
  return list;
};
