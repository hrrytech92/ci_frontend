import React, { useState } from 'react';
import { DateTimeInput } from 'semantic-ui-calendar-react';
import { Button, Popup } from 'semantic-ui-react';
import moment from 'moment';
import 'moment-timezone';

const SchedulePopup = ({ scheduledSendTime, scheduleCampaignMessage }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const buttonContent = loading ? 'Scheduling' : 'Schedule';

  return (
    <Popup
      on="click"
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button disabled={loading} content={buttonContent} color="green" icon="clock" />}
      content={
        <>
          <DateTimeInput
            inline
            dateFormat="YYYY-MM-DD"
            placeholder="Date Time"
            value={scheduledSendTime}
            iconPosition="left"
            onChange={(evt, { value }) => {
              setLoading(true);
              const gmtTime = moment(value)
                .utc()
                .format('YYYY-MM-DDTHH:mm');
              scheduleCampaignMessage(gmtTime).then(() => {
                setLoading(false);
              });
            }}
          />
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </>
      }
    />
  );
};

export default SchedulePopup;
