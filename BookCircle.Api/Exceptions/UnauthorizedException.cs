using System.Net;

namespace BookCircle.Api.Exceptions;

public sealed class UnauthorizedException(string message) : ApiException(message, (int)HttpStatusCode.Unauthorized);
