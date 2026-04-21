using System.Net;

namespace BookCircle.Api.Exceptions;

public sealed class ForbiddenException(string message) : ApiException(message, (int)HttpStatusCode.Forbidden);
