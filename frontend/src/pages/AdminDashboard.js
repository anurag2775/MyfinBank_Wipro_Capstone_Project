import { Link } from "react-router-dom";
import adminUsersImg from "../assets/dashboard/admin-users.png";
import adminLoansImg from "../assets/dashboard/admin-loans.png";
import adminChatImg from "../assets/dashboard/admin-chat.png";

function AdminDashboard() {
  return (
    <div className="dashboard-bg">
      <div className="container-fluid px-4">

        <h3 className="text-primary text-center mb-4">
          Admin Dashboard
        </h3>

        
        <div className="col-12 col-lg-10 mx-auto">

          {/* Manage Users */}
          <Link to="/admin/users" className="text-decoration-none">
            <div className="card dashboard-row-card shadow-sm">
              <div className="img-wrapper">
                <img src={adminUsersImg} alt="Manage Users" />
                <div className="img-overlay"></div>
                <div className="overlay-text">
                  <h5>Manage Users</h5>
                  <p>Activate / Deactivate customer accounts</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Approve Loans */}
          <Link to="/admin/loans" className="text-decoration-none">
            <div className="card dashboard-row-card shadow-sm">
              <div className="img-wrapper">
                <img src={adminLoansImg} alt="Approve Loans" />
                <div className="img-overlay"></div>
                <div className="overlay-text">
                  <h5>Approve Loans</h5>
                  <p>Review and approve customer loan requests</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Customer Chats */}
          <Link to="/admin/chat" className="text-decoration-none">
            <div className="card dashboard-row-card shadow-sm">
             <div className="img-wrapper">
                <img src={adminChatImg} alt="Customer Chats" />
                <div className="img-overlay"></div>
                <div className="overlay-text">
                 <h5>Customer Chats</h5>
                 <p>Respond to customer queries</p>
                </div>
             </div>
           </div>
         </Link>

        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;


