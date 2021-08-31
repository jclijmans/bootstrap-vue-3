# Table
For displaying tabular data, `<b-table>` supports pagination, filtering, sorting, custom rendering, various style options, events, and asynchronous data.

## Table style options

### Table caption
Add an optional caption to your table via the prop caption or the named slot `table-caption` (the slot takes precedence over the prop). The default Bootstrap v5 styling places the caption at the bottom of the table:

<ClientOnly>
    <b-card>
        <b-button variant="primary" class="position-relative">
            Inbox
            <b-badge variant="danger" dot-indicator>
                <span class="visually-hidden">New alerts</span>
            </b-badge>
        </b-button>
    </b-card>
</ClientOnly>

``` html
<b-button variant="primary" class="position-relative">
    Inbox
    <b-badge variant="danger" dot-indicator>
        <span class="visually-hidden">New alerts</span>
    </b-badge>
</b-button>
```

## Component reference
### `<b-table>`
### Properties

| Property | Type | Default | Description
| --- | --- | --- | --- |
| `align` | `String` |  | Sets the vertical alignment of content within a cell. Possible values : 'baseline', 'top', 'middle', 'bottom', 'text-top' or 'text-bottom'<br/>Table cells of `<thead>` are always vertical aligned to the bottom. Table cells in `<tbody>` inherit their alignment from `<table>` and are aligned to the the top by default. Use align to re-align where needed.
| `bordered` | `Boolean` | `false` | Adds borders to all the cells and headers
| `borderless` | `Boolean` | `false` | Removes all borders from cells
| `borderVariant` | `String` |  | Applies one of the Bootstrap theme color variants to the table border
| `caption` | `String` |  | Text string to place in the caption element
| `dark` | `Boolean` |  | Places the table in dark mode
| `fields` | `Array` |  | Array of field names or array of field definition objects
| `footClone` | `Boolean` | `false` | Enable to the footer of the table, and clone the header content by default
| `hover` | `Boolean` | `false` | Enables hover styling on rows
| `items` | `Array` | `[]` | Array of items to display
| `responsive` | `Boolean` or `String` | `false` | Makes the table responsive in width, adding a horizontal scrollbar. Set to true for always responsive or set to one of the breakpoints to switch from responsive to normal: 'sm', 'md', 'lg', 'xl'
| `small` | `Boolean` | `false` | Renders the table with smaller cell padding
| `striped` | `Boolean` | `false` | Applies striping to the tbody rows
| `variant` | `String` |  | Apply a Bootstrap theme color variant to the entire table


### Slots

| Name  | Scoped | Description |
| --- | --- | --- |
| `table-caption`  | no | Content to display in the table's caption element |



