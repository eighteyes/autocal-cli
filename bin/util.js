export function lookupContextName(id) {
  const opts = {
    type: 'context',
    format: 'array',
    lookup: 'display',
    filterVal: id - 1,
  };
  return get(argv.plan, opts)[0];
}
