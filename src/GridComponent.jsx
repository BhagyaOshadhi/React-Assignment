class GridComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false, products: [] };
  }
  componentDidMount() {
    fetch("http://localhost:3000/products?_page=10&_limit=15")
      .then((response) => response.json())
      .then((ProductsList) => {
        this.setState({ products: ProductsList });
        console.log(this.state.products);
      });
  }
  render() {
    if (this.state.liked) {
      return "You liked this.";
    }

    return (
      <div>
        <button onClick={() => this.setState({ liked: true })}>
          Like hiru
        </button>
        {this.state.products.map((product) => {
          return (
            <div>
              <Button variant="contained" color="primary">
                Primary
              </Button>
              <h3>{product.id}</h3>
              <h3>{product.price}</h3>
              <h3>{product.face}</h3>
            </div>
          );
        })}
      </div>
    );
  }
}

let domContainer = document.querySelector("#GridComponent");
ReactDOM.render(<GridComponent />, domContainer);
