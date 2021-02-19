import React from "react";

const ControlPanel = ({ handleScan, whale, handleTransaction }) => {
  // const [copySuccess, setCopySuccess] = useState("");
  //   const textAreaRef = useRef(null);
  //   const copyToClipboard = (e) => {
  //     e.preventDefault();
  //     e.textArea.select();
  //     document.execCommand("copy");
  //     // This is just personal preference.
  //     // I prefer to not show the whole text area selected.
  //     e.target.focus();
  //     setCopySuccess("Copied!");
  //   };
  return (
    <div className="card-body p-0">
      <div className="d-md-flex">
        <div className="p-1 flex-fill">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Token</th>
                <th scope="col">Name</th>
                <th scope="col">Address</th>
                <th scope="col">Balance</th>
                <th scope="col">Current Price</th>
                <th scope="col">Avg Buy Price</th>
                <th scope="col">Total Value</th>
              </tr>
            </thead>
            <tbody className="whale-list">
              {whale &&
                whale.map((e, index) => {
                  return (
                    <tr key={index}>
                      <td>{e.symbol}</td>
                      <td>{e.name}</td>
                      <td scope="col" className="overflow-hidden">
                        <a
                          href={`https://etherscan.io/token/${e.address}`}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          Etherscan Address
                        </a>
                      </td>
                      <td>
                        {new Intl.NumberFormat("en-US").format(e.balance)}
                      </td>
                      <td>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(e.currentPrice)}
                      </td>
                      <td>Weighted Price</td>
                      <td>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(e.totalValue)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="card-pane-right bg-success pt-2 pb-2 pl-4 pr-4">
          <button className="btn btn-primary" onClick={handleScan}>
            Scan Address
          </button>
          <button className="btn btn-primary" onClick={handleTransaction}>
            Get Transactions
          </button>
        </div>
        {/* /.card-pane-right */}
      </div>
      {/* /.d-md-flex */}
    </div>
  );
};

export default ControlPanel;
