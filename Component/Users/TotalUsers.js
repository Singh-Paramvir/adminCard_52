import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import SideBar from "../SideBar";
import { useRouter } from "next/router";
import { DatePicker } from "antd";
import moment from "moment";
const { RangePicker } = DatePicker;
import ReactPaginate from "react-paginate";

const TotalUsers = () => {
  const [users, setUsers] = useState([]);
  const router = useRouter();
  const [searchData, setSearchData] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);
  const [oldData, setOldData] = useState([]);
  const [profile, setProfile] = useState();
  const [fromDate, setFromDate] = useState();
  const [oldDate, setOldDate] = useState();
  const [added, setAdded] = useState()

  async function getUsers() {
    try {
      const token = localStorage.getItem("token");
      let res = await axios.post("/api/users/getUsers", { token: token });
      const response = res.data;
      console.log(response.data, "to get the response from api to get users");
      setUsers(response.data);
      setOldData(response.data);
      setOldDate(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getUsers();
  }, [added]);

  async function serachFn(e) {
    console.log(e.target.value);
    const search = e.target.value;
    console.log(oldData, "old data here");
    const filteredData = oldData?.filter((item) => {
      const name = item?.name;
      return name?.toLowerCase().includes(search.toLowerCase());
    });
    console.log(filteredData, "to get the value of the filtered Data");
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const searchPosts = filteredData?.slice(indexOfFirstPost, indexOfLastPost);
    console.log(searchPosts, "search post");
    setSearchData(searchPosts);

    if (search == "") {
      setUsers(users);
    } else {
      setSearchData(searchPosts);
    }
    // setUsers(searchData)
  }

  async function setDateFunction(e) {
    try {
      const zeroData = e[0].$d;
      const firstData = e[1].$d;
      const filteredDate = oldDate?.filter((item) => {
        const dateData = new Date(item?.createdAt).toLocaleDateString();

        return (
          dateData >= new Date(zeroData).toLocaleDateString() &&
          dateData <= new Date(firstData).toLocaleDateString()
        );
      });
      setUsers(filteredDate);

      if (filteredDate == []) {
        setUsers(users);
      } else {
        setUsers(filteredDate);
      }
      const valueOfPaginate = Math.ceil(users?.length / postsPerPage);
    } catch (err) {
      console.log(err);
      setUsers(oldData);
    }
  }

  // Pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  var currentPosts = users?.slice(indexOfFirstPost, indexOfLastPost);

  const Pagination = ({ selected }) => {
    setCurrentPage(selected + 1);
    setSearchData(null);
    setUsers(users);
  };


  async function deleteUser(data){
    try{
    const res = await axios.post("/api/users/deleteUsers",data)
    const response= res.data
    console.log(response,"delete user response")
    setAdded(added+1)
  }catch(err){
    console.log(err)
  }
}

 async function deleteUserSubmitHandler(e){
  const data ={
    id:e,
  }
  deleteUser(data)
 }



  return (
    <>
      <div className="new-dashboard">
        <SideBar />

        <section
          className="profile-sec pb-0 profile-sects"
          id="totalUserProfileSec"
        >
          <div className="container">
            <div className="row justify-content-center">
              {/* <div className="Cards-head mt-0"> */}

              <div className="left-dashboard mt-0 " id="lr-id">
                <div
                  className="rapper-between mb-5 mt-3"
                  id="token-form-padding"
                >
                  <h5 className="heading-text pink-text ">ALL PROFILES</h5>
                  <h5 className="hide-text">1</h5>
                </div>

                <div className="search-bar-sec">
                  <div className="input-group mb-1" id="search-bar-set">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="bi bi-search"></i>
                    </span>

                    <input
                      type="text"
                      className="form-control w-25"
                      placeholder="Search"
                      onChange={(e) => serachFn(e)}
                    />
                  </div>

                  <div className="rangePicker-Div">
                    <RangePicker onChange={(e) => setDateFunction(e)} />
                  </div>
                </div>

                <table className="table funds-table mt-3" id="funds-color">
                  <thead>
                    <tr className="">
                      <th id="fuds" scope="col">
                        Sr. No.
                      </th>
                      <th id="fuds" scope="col">
                        Name
                      </th>
                      <th id="fuds" scope="col">
                        Gender
                      </th>
                      <th id="fuds" scope="col">
                        Age
                      </th>
                      <th id="fuds" scope="col">
                        Country
                      </th>
                      <th id="fuds" scope="col">
                        Status
                      </th>
                      <th id="fuds" scope="col"></th>

                      <th id="fuds" scope="col"></th>
                    </tr>
                  </thead>

                  <tbody >
                    {searchData == null
                      ? currentPosts?.map((item, id) => {
                          return (
                            <tr className="tbody-tr">
                              <td className="total-account">{id + 1}</td>
                              <td className="total-account">{item.name}</td>
                              <td className="total-account">{item.gender}</td>
                              <td className="total-account">{item.age}</td>
                              <td className="total-account">{item.country}</td>

                              <td className="total-account " id="right-textset">
                              <Link href={"/userDetails/" + item.id}>
                                  <button
                                    type="button"
                                    className="btn view-btn"
                                  >
                                    View
                                  </button>
                                </Link>
                              </td>
                            

                              <td className="total-account td-width" id="right-textset">
                                <Link href={"/editDetails/" + item.id}>

                                <i class="bi bi-pencil-square td-icons"  id="edit-btn"></i>
                                </Link>
                              </td>



                              <td
                                className="total-account  td-width"
                                // id="right-textset"
                                onClick={() => deleteUserSubmitHandler(item?.id)}
                              >
                                <i  style={{ cursor: "pointer" }} className="bi bi-trash3 td-icons" id="pin-dark-icon" ></i>{" "}
                              </td>
                            </tr>
                          );
                        })
                      : searchData?.map((item, id) => {
                          return (
                            <tr>
                              <td className="total-account">{id + 1}</td>
                              <td className="total-account">{item.name}</td>
                              <td className="total-account">{item.gender}</td>
                              <td className="total-account">{item.age}</td>
                              <td className="total-account">{item.country}</td>

                              <td className="total-account " id="right-textset">
                                <Link href={"/userDetails/" + item.id}>
                                  <button
                                    type="button"
                                    className="btn view-btn"
                                  >
                                    View
                                  </button>
                                </Link>
                              </td>
                              <td className="total-account " id="right-textset">
                              <i class="bi bi-pencil-square"  id="edit-btn"></i>
                              </td>

                              <td
                                className="total-account right-textset"
                                id="right-textset"
                                onClick={() => deleteUserSubmitHandler(item?.id)}
                              >
                                <i
                                  style={{ cursor: "pointer" }}
                                  className="bi bi-trash3"
                                  id="pin-dark-icon"
                                ></i>{" "}
                              </td>
                            </tr>
                          );
                        })}
                  </tbody>
                </table>
              </div>

              {/* </div> */}
              <div className="paginate-sec">
                <ReactPaginate
                  previousLabel="← Previous"
                  nextLabel="Next →"
                  onPageChange={Pagination}
                  pageCount={Math.ceil(users?.length / postsPerPage)}
                  containerClassName="pagination"
                  previousLinkClassName="pagination__link"
                  nextLinkClassName="pagination__link"
                  disabledClassName="pagination__link--disabled"
                  activeClassName="pagination__link--active"
                  className="page-link"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default TotalUsers;
