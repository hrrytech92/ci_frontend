import React from 'react';
import { Segment, Statistic } from 'semantic-ui-react';

function format(number) {
  return new Intl.NumberFormat('en-US').format(number);
}

export const Stats = ({ stats }) => (
  <Segment data-test="stats">
    <Statistic.Group size="tiny" widths={7} color="grey">
      {Object.keys(stats).map(stat => (
        <Statistic key={stat}>
          <Statistic.Value>{format(stats[stat])}</Statistic.Value>
          <Statistic.Label>{stat.replace('_', ' ').replace('_', ' ')}</Statistic.Label>
        </Statistic>
      ))}
    </Statistic.Group>
  </Segment>
);
