// middleware for doing role-based permissions
const role = (...roles) => {
  return (request, response, next) => {
    const { user } = request;
    if (user && roles.includes(user.role)) next();
    else
      response
        .status(403)
        .json({ message: "Tа энэ хэсэгт хандах эрхгүй байна." });
  };
};
module.exports = role;
