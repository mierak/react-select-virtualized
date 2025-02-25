import React from 'react';
import { storiesOf } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withState } from '@dump247/storybook-state';
// this is a workaround for storybook, storybook and addon-info does not work with react.memo. I will create a wrapper to fix this.
// here you will import the component per the documentation `import Select from 'path-to-select'`
import Select from './_SelectTablePropsStoryFix';
import { optionsDefault, opsGroup, defaultValue, op1500, ops2500 } from '../../../data';

storiesOf(`React Select Virtualized/props`, module)
  .addDecorator((story) => <div style={{ width: '30em' }}> {story()} </div>)
  .addDecorator(withInfo)
  .addParameters({
    info: {
      source: true,
      maxPropsIntoLine: 1,
    },
  })
  .add('Basic', () => <Select options={optionsDefault} />)
  .add('with default value uncontrolled', () => <Select defaultValue={defaultValue} options={optionsDefault} />)
  .add('with default value controlled', () => <Select value={defaultValue} options={optionsDefault} />)
  .add(
    'with value controlled',
    withState({ value: defaultValue })(({ store }) => (
      <Select
        value={store.state.value}
        options={optionsDefault}
        onChange={(val) => {
          store.set({ value: val });
        }}
      />
    )),
  )
  .add('with minimum input to 3', () => <Select options={op1500} minimumInputSearch={3} />)
  .add('disabled select', () => <Select options={optionsDefault} isDisabled />)
  .add('empty options in the select', () => <Select noOptionsMessage={() => 'No Items...'} options={[]} />)
  .add('select with custom labels format', () => {
    const labelFormat = ({ label, lang }, { context }) => {
      if (context === 'value') return `${label} - ${lang}`;
      return `${label} - ${lang}`;
    };

    return <Select options={ops2500} defaultValue={defaultValue} formatOptionLabel={labelFormat} />;
  })
  .add('grouped default', () => <Select options={opsGroup} defaultValue={defaultValue} grouped />)
  .add(
    'grouped with value controlled',
    withState({ value: defaultValue })(({ store }) => (
      <Select
        value={store.state.value}
        options={opsGroup}
        onChange={(val) => {
          store.set({ value: val });
        }}
        grouped
      />
    )),
  )
  .add('grouped custom format', () => {
    // this can be a css also
    const groupStyle = {
      background: 'lightcoral',
      height: '4em',
      lineHeight: '4em',
      textAlign: 'center',
      fontFamily: 'monospace',
    };

    const groupHeaderHeight = 50;

    const groupFormat = ({ label, options }) => (
      <div style={groupStyle}>
        {label} --- ({options.length}) items in this group
      </div>
    );

    return (
      <Select
        options={opsGroup}
        defaultValue={defaultValue}
        formatGroupHeaderLabel={groupFormat}
        groupHeaderHeight={groupHeaderHeight}
        grouped
      />
    );
  });
