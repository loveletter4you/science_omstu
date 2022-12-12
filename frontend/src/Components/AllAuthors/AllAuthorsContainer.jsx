import React  from "react";
import axios from "axios";
import AllAuthors from "./AllAuthors";
import {connect} from "react-redux";
import {setAllAuthors } from "../../Redux/all-authors-reduser";

class AuthorsContainer extends React.Component {
    componentDidMount() {
        axios.get(`/api/authors?page=0&limit=15`).then(response => {
            this.props.setAllAuthors(response.data.authors);
        });
    }

    render() {
        return (
            <div>
                <AllAuthors {...this.props} authors={this.props.authors}/>
            </div>)
    }
}

let mapStateToProps = (state) => {
    return {
        authors: state.allAuthorsPage.authors

    }

}

export default connect(mapStateToProps, {setAllAuthors})(AuthorsContainer);
