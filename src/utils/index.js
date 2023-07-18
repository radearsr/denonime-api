exports.createOrderBy = (key, value) => {
  const obj = {};
  obj[key] = value;
  return obj;
};

exports.createWhereQuery = (status, type) => {
  if (status === "*" && type === "*") {
    return {};
  }
  if (type === "*") {
    return {
      status,
    };
  }
  if (status === "*") {
    return {
      anime_type: type,
    };
  }
  return {
    anime_type: type,
    status,
  };
};
