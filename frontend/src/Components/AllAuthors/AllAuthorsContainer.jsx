import React  from "react";
import axios from "axios";
import AllAuthors from "./AllAuthors";
import {connect} from "react-redux";
import {setAllAuthors, setAuthorsTotalCount, setCurrentPage} from "../../Redux/all-authors-reduser";

class AuthorsContainer extends React.Component {
    componentDidMount() {
        axios.get(`/api/authors?page=${this.props.currentPage-1}&limit=${this.props.pageSize}`).then(response => {
            this.props.setAllAuthors(response.data.authors);
            this.props.setAuthorsTotalCount(response.data.total_authors);
        });
    }
    onPageChange = (pageNumber) => {
        this.props.setCurrentPage(pageNumber)
        axios.get(`/api/authors?page=${pageNumber-1}&limit=${this.props.pageSize}`).then(response => {
            this.props.setAllAuthors(response.data.authors);
        });
    }

    render() {
        return (
            <>
                <AllAuthors {...this.props}
                            authors={this.props.authors}
                            onPageChange={this.onPageChange}
                            totalAuthors={this.props.totalAuthors}
                            pageSize={this.props.pageSize}
                            currentPage={this.props.currentPage}/>
            </>)
    }
}

let mapStateToProps = (state) => {
    return {
        authors: state.allAuthorsPage.authors,
        pageSize: state.allAuthorsPage.pageSize,
        totalAuthors: state.allAuthorsPage.totalAuthors,
        currentPage: state.allAuthorsPage.currentPage
    }

}

export default connect(mapStateToProps, {setAllAuthors, setCurrentPage, setAuthorsTotalCount})(AuthorsContainer);
