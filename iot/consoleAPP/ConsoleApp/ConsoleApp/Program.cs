using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO.Ports;
using System.Net;
using System.IO;

namespace ConsoleApp
{
    class Program
    {
        static SerialPort sp;
        static void Main(string[] args)
        {
            var SP = new SerialPort();
            SP.PortName = "com3";
            SP.BaudRate = 9600;
            SP.ReadTimeout = 2000000;
            SP.Open();

            // 06.08.2010//12:04:12//06.08.2010//12:04:14//0//0//1658

            while (true)
            {
                //string line = "06.08.2010/12:04:12/06.08.2010/12:04:14/0/0/1658/121";
                string line = SP.ReadLine();
                if (String.IsNullOrEmpty(line))
                    continue;

                string[] arg = line.Split('/');
                string[] time1 = arg[0].Split('.');
                string[] time2 = arg[1].Split(':');
                DateTime start = new DateTime(Convert.ToInt32(time1[2]), Convert.ToInt32(time1[1]), 
                                              Convert.ToInt32(time1[0]), Convert.ToInt32(time2[0]),
                                              Convert.ToInt32(time2[1]), Convert.ToInt32(time2[2]));
                time1 = arg[2].Split('.');
                time2 = arg[3].Split(':');
                DateTime end = new DateTime(Convert.ToInt32(time1[2]), Convert.ToInt32(time1[1]),
                                              Convert.ToInt32(time1[0]), Convert.ToInt32(time2[0]),
                                              Convert.ToInt32(time2[1]), Convert.ToInt32(time2[2]));

                int level_start = Convert.ToInt32(arg[4]);
                int level_end = Convert.ToInt32(arg[5]);
                int flight_id = Convert.ToInt32(arg[6]);


                TimeSpan delta = end - start;
                var json_start_time = Convert.ToInt32(DateTime.UtcNow.Subtract(start).TotalSeconds);
                var json_end_time = Convert.ToInt32(DateTime.UtcNow.Subtract(end).TotalSeconds);

                var httpWebRequest = (HttpWebRequest)WebRequest.Create("http://127.0.0.1:5000/api/add_flight_event");
                httpWebRequest.ContentType = "application/json";
                httpWebRequest.Method = "POST";

                using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                {
                    string json = "{\"start_time\":\"" + json_start_time + "\"," +
                                  "\"field_id\":\"" + flight_id + "\"," +
                                  "\"end_time\":\"" + json_end_time + "\"," +
                                  "\"start_level\":\"" + level_start + "\"," +
                                  "\"end_level\":\"" + level_end + "\"}";

                    streamWriter.Write(json);
                }

                var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                string result = "";
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    result = streamReader.ReadToEnd().ToString();
                }

                var now = DateTime.Now;
                Console.WriteLine($"[{now.ToLongTimeString()}] [Logs] :");
                Console.Write($"Response: {result}");
                Console.WriteLine($"Level difference: {Math.Abs(level_start - level_end)}");
                Console.WriteLine($"Time difference: {delta} (seconds)\n");
            }
        }
    }
}
