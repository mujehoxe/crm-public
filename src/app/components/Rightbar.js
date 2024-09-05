import Link from "next/link";
import TokenDecoder from "./Cookies";

const Rightbar = ({ userData }) => {
  const rightsidebar = (e) => {
    e.preventDefault();
    document.body.classList.remove("right-bar-enabled");
  };

  const userRole = userData ? userData.role : null;

  return (
    <>
      <div className="right-bar fixed right-0">
        <div className="rightbar-title d-flex align-items-center px-3 py-4">
          <h5 className="m-0 me-2">Settings</h5>
          <a
            href="/"
            className="right-bar-toggle ms-auto"
            onClick={rightsidebar}
          >
            <i className="fa fa-times noti-icon" />
          </a>
        </div>

        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">Menu</li>
            {userRole == "superAdmin" ||
            userRole == "Admin" ||
            userRole == "Marketing" ||
            userRole == "Operations" ||
            userRole == "BussinessHead" ||
            userRole == "PNL" ||
            userRole == "TL" ||
            userRole == "FOS" ||
            userRole == "ATL" ? (
              <li>
                <Link href={"/Tags"}>
                  <i className="fas fa-tags" />
                  <span className="badge rounded-pill bg-success float-end">
                    3
                  </span>
                  <span>Tags</span>
                </Link>
              </li>
            ) : null}
            <li>
              {userRole == "superAdmin" || userRole == "Admin" ? (
                <Link href={"RolePerms"}>
                  <i className="fas fa-tags" />
                  <span className="badge rounded-pill bg-success float-end">
                    3
                  </span>
                  <span>Role Permissions</span>
                </Link>
              ) : null}
            </li>
            <li className="menu-title">Menu</li>
            <li>
              <Link href={"/Status/list"}>
                <i className="fas fa-tags" />
                <span className="badge rounded-pill bg-success float-end">
                  3
                </span>
                <span>Status</span>
              </Link>
            </li>
            <li>
              <Link href={"/Source/list"}>
                <i className="fas fa-tags" />
                <span className="badge rounded-pill bg-success float-end">
                  3
                </span>
                <span>Source</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Rightbar;
