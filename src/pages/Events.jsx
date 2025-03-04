import React from "react";
import "./EventSection.css"; // Import CSS file

const EventSection = () => {
  return (
    <div className="event-section">
    <h2 className="event-title">Events</h2>
      {/* First Event - Image Right */}
      <div className="event event-reverse">
        <div className="event-description">
          <h2>Event One</h2>
          <p>
            This is the description for the first event. It includes details
            about what the event is about, the activities involved, and why
            people should attend.
          </p>
        </div>
        <div className="event-image">
          <img src="/Images/labour-modified.jpg" alt="Event 1" />
        </div>
      </div>

      {/* Second Event - Image Left */}
      <div className="event">
        <div className="event-description">
          <h2>Event Two</h2>
          <p>
            This is the description for the second event. Here we provide
            additional insights, highlights, and why attendees should be
            excited.
          </p>
        </div>
        <div className="event-image">
          <img src="/Images/labour-modified.jpg" alt="Event 2" />
        </div>
      </div>
      {/* Third Event - Image Right */}
      <div className="event event-reverse">
        <div className="event-description">
          <h2>Event Third</h2>
          <p>
            This is the description for the first event. It includes details
            about what the event is about, the activities involved, and why
            people should attend.
          </p>
        </div>
        <div className="event-image">
          <img src="/Images/labour-modified.jpg" alt="Event 1" />
        </div>
      </div>
    </div>
  );
};

export default EventSection;
