<script lang="jsx">
export default function render(_props, _context) {debugger
  const context = {
    ..._context,
    props: _props,
    data: _context.attr,
    children: _context.slots,
  }
  const { icon, title } = context.props
  const vnodes = []

  if (icon) {
    vnodes.push(<svg-icon icon-class={icon} />)
  }

  if (title) {
    vnodes.push(<span name="title">{title}</span>)
  }
  return vnodes
}
</script>
