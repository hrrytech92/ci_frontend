import * as React from 'react';
import { connect } from 'react-redux';
import { IRedux } from '../../definitions/redux';
import './PageLocker.scss';

interface IProps {
  locked: boolean;
  children: any;
}

const PageLocker: React.SFC<IProps> = (props: IProps) => {
  const { locked, children } = props;
  return (
    <div className={`complete-lock ${locked ? 'locked' : ''}`}>
      <div className={`overlay`} />
      {children}
    </div>
  );
};

const mapStateToProps = (state: IRedux) => ({});

export default connect(
  mapStateToProps,
  {},
)(PageLocker);
