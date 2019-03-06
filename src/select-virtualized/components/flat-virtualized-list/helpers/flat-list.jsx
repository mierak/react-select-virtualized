import React from 'react';

import { FastOption } from '../../fast-option';

export const flatVirtualizedListRowRenderer = ({ list, onOptionFocused, optionHeight, formatOptionLabel }) => ({
  key,
  index,
  style,
  isVisible,
  isScrolling,
}) => {
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
