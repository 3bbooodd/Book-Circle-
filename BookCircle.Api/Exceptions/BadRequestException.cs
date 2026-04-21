using System.Net;

namespace BookCircle.Api.Exceptions;

public sealed class BadRequestException(string message) : ApiException(message, (int)HttpStatusCode.BadRequest);
