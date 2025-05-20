using EventBus.Messages.Events;
using MassTransit;
using MediatR;
using Notification.Application.Features.Notification.Commands.AddNoti;

namespace Notification.API.EventBusConsumer
{
    public class AddNotificationConsumer : IConsumer<NotificationEvent>
    {
        private readonly ILogger<AddNotificationConsumer> _logger;
        private readonly IMediator _mediator;

        public AddNotificationConsumer(ILogger<AddNotificationConsumer> logger, IMediator mediator)
        {
            _logger = logger;
            _mediator = mediator;
        }

        public async Task Consume(ConsumeContext<NotificationEvent> context)
        {
            var command = new AddNotiCommand
            {
                Username = context.Message.UserNameNhan,
                UsernameComment = context.Message.UserNameComment,
                NoiDung = context.Message.Message,
                PostId = context.Message.PostId
            };

            // Fix: Use MediatR's Send method correctly
            var result = await _mediator.Send(command);
            _logger.LogInformation("Add NotificationEvent Consume success. Id : {Id}", result);
        }
    }
}
