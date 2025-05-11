using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EventBus.Messages.Events
{
    class IntegrationBaseEvent
    {
        public Guid Id { get; private set; }

        public DateTime CreationDate { get; private set; } = DateTime.UtcNow;
    }
}
