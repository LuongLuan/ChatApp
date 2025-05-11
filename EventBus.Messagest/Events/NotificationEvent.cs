using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventBus.Messages.Events
{
    public class NotificationEvent
    {
        public string UserNameNhan { get; set; } = null!;
        public string UserNameComment { get; set; } = null!;
        public string Message { get; set; } = null!;
        public string PostId { get; set; } = null!;
    }
}
