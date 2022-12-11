import React from "react";
import Author from "./Author";
import {connect} from "react-redux";
import axios from "axios";
import {setAuthors} from "../../Redux/authors-reducer";
import {useLocation, useNavigate, useParams} from "react-router-dom";


class AuthorsContainer extends React.Component {
    componentDidMount() {
        let id = this.props.router.params.id;
        axios.get(`/api/author/` + id).then(response => {
            this.props.setAuthors(response.data);
        });
    }

    render() {
        return (
            <div>
                <Author {...this.props} author={this.props.author}/>
            </div>)
    }
}

let mapStateToProps = (state) => {
    return {
        author: state.authorsPage.author,
    }

}

function withRouter(Component) {
    function ComponentWithRouterProp(props) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        return (
            <Component
                {...props}
                router={{ location, navigate, params }}
            />
        );
    }
    return ComponentWithRouterProp;
}

export default connect(mapStateToProps, {setAuthors})(withRouter(AuthorsContainer));