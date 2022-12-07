import * as qs from 'query-string';
import * as React from 'react';

interface IProps {
  paginationCallback: any;
  data: any;
}

class Pagination extends React.Component<IProps> {
  public handlePagination = direction => {
    const { data } = this.props;
    let url;

    switch (direction) {
      case 0: {
        // goback to beginning
        url = '';
        break;
      }
      case 1: {
        // goback
        url = data.previous.substr(data.previous.indexOf('?'));
        break;
      }
      case 2: {
        // go forward
        url = data.next.substr(data.next.indexOf('?'));
        break;
      }
      case 3: {
        const parsed = this.parseUrl(data.next);
        // go to end
        const numberToOffset = Math.floor(data.count / data.results.length) * parsed.limit;
        url = `?limit=${parsed.limit}&offset=` + (numberToOffset - 1);
        break;
      }
      default: {
        break;
      }
    }

    this.props.paginationCallback(url);
  };

  public parseUrl(url) {
    if (!url) {
      return;
    }
    return qs.parse(url.split('?')[1]);
  }

  public render() {
    const { data } = this.props;

    return (
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          {!!data.previous && (
            <React.Fragment>
              <li className="page-item">
                <a
                  className="page-link"
                  onClick={() => this.handlePagination(0)}
                  href="#"
                  aria-label="First"
                >
                  <span>First</span>
                </a>
              </li>
              <li className="page-item">
                <a
                  className="page-link"
                  onClick={() => this.handlePagination(1)}
                  href="#"
                  aria-label="Previous"
                >
                  <span aria-hidden="true">&laquo;</span>
                  <span className="sr-only">Previous</span>
                </a>
              </li>
            </React.Fragment>
          )}
          {!!data.next && (
            <React.Fragment>
              <li className="page-item">
                <a
                  className="page-link"
                  onClick={() => this.handlePagination(2)}
                  href="#"
                  aria-label="Next"
                >
                  <span aria-hidden="true">&raquo;</span>
                  <span className="sr-only">Next</span>
                </a>
              </li>
              <li className="page-item">
                <a
                  className="page-link"
                  onClick={() => this.handlePagination(3)}
                  href="#"
                  aria-label="Last"
                >
                  <span>Last</span>
                </a>
              </li>
            </React.Fragment>
          )}
        </ul>
      </nav>
    );
  }
}

export default Pagination;
