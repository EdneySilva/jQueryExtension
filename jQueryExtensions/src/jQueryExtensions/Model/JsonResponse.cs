using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace jQueryExtensions.Model
{
    public class JsonData
    {
        public string Message { get; set; }
        public ResponseStatus Response { get; set; }
    }

    public class JsonResponse
    {
        public JsonData Data { get; set; }

        public static JsonResponse Success(string message)
        {
            return new JsonResponse
            {
                Data = new JsonData
                {
                    Response = ResponseStatus.Success,
                    Message = message
                }
            };
        }
    }
}
