import { GroupVirtualizedListFactory } from '../../grouped-virtualized-list';
import { FlatVirtualizedListFactory } from '../../flat-virtualized-list';

// this is very basic analize a bit more
export const calculateDebounce = (size) => {
  if (size <= 30000) {
    return (size + 100) * 0.001; // approx 0.001 ms per action, calculate 100 extra actions. this is a constant value. pefromance degradation starts after 30000 elements
  }
  return 300;
};

export const filterByLowercaseLabel = (list, value) => list.filter((item) => item.lowercaseLabel.includes(value));

export const defaultFormatOptionLabel = (item) => item.label;

export const mapLowercaseLabel = (list, formatOptionLabel = defaultFormatOptionLabel, iterator = () => ({})) =>
  list.map((item) => ({
    lowercaseLabel: formatOptionLabel(item, {}).toLowerCase(),
    ...item,
    ...iterator(item),
  }));

export const buildListComponents = (props) => {
  const components = {};
  components.MenuList = props.grouped
    ? GroupVirtualizedListFactory({
        formatGroupHeader: props.formatGroupHeaderLabel,
        groupHeaderHeight: props.groupHeaderHeight,
        optionHeight: props.optionHeight,
        defaultValue: props.defaultValue,
      })
    : FlatVirtualizedListFactory({
        optionHeight: props.optionHeight,
        defaultValue: props.defaultValue,
        formatOptionLabel: props.formatOptionLabel,
        input: props.input,
      });

  return components;
};
