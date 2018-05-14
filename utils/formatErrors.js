export const formatErrors = (error, otherErrors) => {
  const { errors } = error
  let objErrors = []

  if (errors) {
    Object.entries(errors).map((err) => {
      const { path, message } = err[1]
      return objErrors.push({ path, message })
    })
    objErrors = objErrors.concat(otherErrors)
    return objErrors
  } else if (otherErrors.length) {
    return otherErrors
  }


  const uknownError = {}
  switch (error.code) {
    case 11000:
      uknownError.path = 'username'
      uknownError.message = 'This username already exists'
      break
    default:
      uknownError.path = 'Unknown'
      uknownError.message = error.message
  }
  return [uknownError]
}

