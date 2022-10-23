import { Col, Row } from "react-bootstrap";
import React from "react";
import Comment from "./Comment";
import { CollapserButton, CollapserChild } from "@/Components/Utils/Collapser";
import {LazyLoadComponent} from "react-lazy-load-image-component";

export default function CommentSection({ user, comments, size=60, className= ''}){

    var rootComments = new Array();
    comments.forEach( (c) => {
        //identify rootComments by checking
        //isreply_to value (if != nan -> is a reply)
        if(c.isreply_to == "nan"){
            rootComments.push(c);
        }
    });
    
    /**
     *  Correctly display comments identifying which is a reply
     *  to another comment and which to parent post
     *  @param comment: comment to print
     */
    function replySorting(comment, depth=1){
	    if(depth > 3)
		return;
            comment.replies = 0;
            //Search for replies of this comment
            //in the rootComments array
            var replies = new Array();
            comments.forEach( (c) => {
                if(c.isreply_to == comment._id && !comment.isdeleted && !comment.isbanned){
                    replies.push(c);
                    comment.replies++;
                }
            });

            var commentTree = new Array();
            commentTree.push(
                <div
                    key={"comment-" + comment._id }
                >
                    <Row>
                        <Comment
                            size={size}
                            user={user}
                            comment={comment}
                            className="my-2 px-2"
			    depth={depth}
                        />

                    </Row>
                        { (replies.length != 0) && (
                            <CollapserChild
                                        targetName={'comment-' + comment._id}
                                        expanded={true}
                            >
                            <Row>
                                <Col
                                     className="d-flex justify-content-center"
                                     style={{
                                         width: size*1.2,
                                         maxWidth: size*1.2
                                     }}
                                >
                                    <div
                                        style={{
                                            color: 'var(--cp-primary-fg)'
                                        }}
                                    ></div>
                                </Col>
                                <Col>
                                        <LazyLoadComponent>
                                            {Object.values(replies).map( function(reply) {
                                                return(replySorting(reply, depth+1));
                                            })}
                                        </LazyLoadComponent>
                                </Col>
                            </Row>
                            </CollapserChild>
                        )}
                </div>
            );
            return commentTree;

    }


    return(
	<div>
            <LazyLoadComponent>
                {Object.values(rootComments).map( function(comment) {
                    return(replySorting(comment));
                })}
            </LazyLoadComponent>
	</div>
    );
}
