<script lang="jsx">
export default function render(_props, _context) {
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
    vnodes.push(<span title={title}>{title}</span>)
  }
  return vnodes
}
</script>
