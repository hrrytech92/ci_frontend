import * as React from 'react';

export default abstract class Form<P = {}, T = {}> extends React.Component<P, T> {
  public handleChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState<any>({
      [name]: value,
    });
  };
}
