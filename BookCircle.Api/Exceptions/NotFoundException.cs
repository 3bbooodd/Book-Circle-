using System.Net;

namespace BookCircle.Api.Exceptions;

public sealed class NotFoundException(string message) : ApiException(message, (int)HttpStatusCode.NotFound);
