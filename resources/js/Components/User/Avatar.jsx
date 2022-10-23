import React from "react";
import BaseAvatar from "react-avatar";
import Anchor from '@/Components/Utils/Anchor';
import Corner from "./Corner";
import {auto} from "@popperjs/core";


export default function Avatar({
                    user: username, 
                    miniMode=false,
                    usernameClassName={},
                    usernameSize='auto',
                    showUsername=false,
                    size=64,
		    info="",
		    infoClassName="",
		    className="",
                    }){

    function genColorV2 (seed) {
        let formatted = 0;
        let color;
        
        for (let i = 0; i < seed.length; i++) {
            formatted += seed.charCodeAt(i);
        }

      color = Math.floor((Math.abs(Math.sin(formatted) * 16777215)));
      color = color.toString(16);
      // pad any colors shorter than 6 characters with leading 0s
      while(color.length < 6) {
        color = '0' + color;
      }

      return color;
    }

    function Username(){
        if(showUsername){
            if(usernameSize === 'auto' && miniMode===false){
                let autoSize = size/3;
                if(autoSize < 12) autoSize = 12;
                usernameSize = autoSize;
            }
            return(
                <Anchor
                    id="creator-username" 
                    className={"" + usernameClassName}
                    routeName='viewuser'
                    routeParams={{username : username}}
                    style={{
                        fontSize: usernameSize
                    }}
                >
                    @{ username }
                </Anchor>
            );
        }
        else return '';
    }

    function ComposedAvatar(){

        let path = '/storage/user/'+username+'/'+username+'.jpg'

        let composer;
        if(!miniMode){
            composer =(
                <>
                    <Anchor
                        routeName="viewuser"
                        routeParams={{username: username}}
                        // className="d-flex align-items-center justify-content-center"
                        >
                            <Corner size={size}>
                                <BaseAvatar
                                    className=''
                                    fgColor="var(--cp-secondary-fg)"
                                    color={'#' + genColorV2(username)}
                                    name={username.replace(/\./, " ")}
                                    round={true}
                                    size={size}
                                    src={path}
                                />
                            </Corner>
                    </Anchor>
                    <Username />
                </>
            );
        }
        else{
            composer =(
                <>
                    <Anchor
                        routeName="viewuser"
                        routeParams={{username: username}}
                        // className="d-flex align-items-center justify-content-center"
                        >
                            <Corner size={size}>
                                <BaseAvatar
                                    className=''
                                    fgColor="var(--cp-secondary-fg)"
                                    color={'#' + genColorV2(username)}
                                    name={username.replace(/\./, " ")}
                                    round={true}
                                    size={size}
                                    src={path}
                                />
                            </Corner>
                    </Anchor>
                    <Username
                        style={{
                            marginLeft: 100
                        }}
                    />
                </>
            );

        }

        return composer;
    }
    function Wrap({children}) {
        if(!miniMode){
            return(
            <div className={"d-flex flex-column align-items-center justify-content-center " + className}>
                {children}
		<div className={"ps-3 " + infoClassName}>
		    {info}
		</div>
            </div>
            );
         } 
        else{
        return(
            <div className={"d-flex align-items-center " + className}>
                {children}
		<div className={"ps-3 " + infoClassName}>
		    {info}
		</div>
            </div>
        );
        }
    }


    return(
        <Wrap>
            <ComposedAvatar />
        </Wrap>
    );

}

