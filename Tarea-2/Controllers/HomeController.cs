using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Tarea_2.Models;
using System.Web;
namespace Tarea_2.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;        

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {            
            return View();
        }
        public IActionResult NuevoCompetidor()
        {
            return View();
        }
        public IActionResult RegistrarTiempo()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }
        [HttpPost]
        public ActionResult RegisterTime(string info)
        {
            HttpContext.Session.SetString("competitor", info);
            return Json("done");
        }
        [HttpPost]
        public ActionResult CompetitorRegistered()
        {
            string result = "";
            if(HttpContext.Session.GetString("competitor") == null)
            {
                result = null;
            }
            else
            {
                result = HttpContext.Session.GetString("competitor");
            }
            return Json(HttpContext.Session.GetString("competitor"));
        }
        [HttpPost]
        public ActionResult NewCompetitor(string userID, string userName)
        {
            if(HttpContext.Session.GetString("competitor") == null)
                HttpContext.Session.SetString("competitor", userID + ", " + userName + ", 0 , 0 *");
            else
            {
                HttpContext.Session.SetString("competitor", HttpContext.Session.GetString("competitor") + userID + ", " + userName + ", 0 , 0 *");
            }
            return Json("done");
        }
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}