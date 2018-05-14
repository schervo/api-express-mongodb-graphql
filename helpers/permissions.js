import { createResolver } from 'apollo-resolvers'
import { createError, isInstance } from 'apollo-errors'

const UnknownError = createError('UnknownError', {
  message: 'An unknown error has occurred!  Please try again later',
})

const baseResolver = createResolver(
  // incoming requests will pass through this resolver like a no-op
  null,

  /*
    Only mask outgoing errors that aren't already apollo-errors,
    such as ORM errors etc
  */
  (root, args, context, error) => (isInstance(error) ? error : new UnknownError()),
)

const ForbiddenError = createError('ForbiddenError', {
  message: 'You are not allowed to do this',
})

const AuthenticationRequiredError = createError('AuthenticationRequiredError', {
  message: 'You must be logged in to do this',
})

// Extract the user from context (undefined if non-existent)
export const isAuthenticatedResolver = baseResolver.createResolver((root, args, { user }) => {
  if (!user) throw new AuthenticationRequiredError()
})

// Extract the user and make sure they are an admin
export const isAdminResolver = isAuthenticatedResolver.createResolver((root, args, { user }) => {
  /*
      If thrown, this error will bubble up to baseResolver's
      error callback (if present).  If unhandled, the error is returned to
      the client within the `errors` array in the response.
    */
  if (!user.isAdmin) throw new ForbiddenError()

  /*
      Since we aren't returning anything from the
      request resolver, the request will continue on
      to the next child resolver or the response will
      return undefined if no child exists.
    */
})
