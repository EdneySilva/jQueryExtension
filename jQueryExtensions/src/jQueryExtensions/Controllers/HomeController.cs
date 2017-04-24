using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using jQueryExtensions.Model;

namespace jQueryExtensions.Controllers
{
    public class HomeController : Controller
    {

        public IActionResult AjaxClick()
        {
            return View();
        }

        [HttpPost]
        public JsonResult AjaxClick(Person person)
        {
            return Json(JsonResponse.Success($"Welcome  {person.Name}"));
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
