import {useAppDispatch} from "../../store";
import {createAlert, resetUserUpdateRequired, setRedirect} from "../../redux/common/reducer";
//@ts-ignore
import request, {RequestStatusCodes, responseType} from "../../api/request";
import {useEffect} from "react";
import paths from "../../api/paths";
import {resetUser} from "../../redux/account/reducer";

const RequestHandler = ({children}: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  request.setApiUrl(process.env.REACT_APP_API_SERVICE as string)
  useEffect(() => {
    request.setPerRequestStatusCodeCb(paths.account.user, RequestStatusCodes.UNAUTHORIZED,(response:Response) => {
      dispatch(resetUserUpdateRequired());
    });
    request.setDefaultStatusCodeCb(RequestStatusCodes.UNAUTHORIZED,(response:Response) => {
      dispatch(resetUser())
      dispatch(createAlert({message: 'You are not authorized', type: 'error'}) as any)
      dispatch(setRedirect({path: '/auth/signin', redirect: true}) as any )
    });
    request.setDefaultStatusCodeCb(RequestStatusCodes.SERVICE_UNAVAILABLE,(response:Response) => {
      dispatch(createAlert({message: 'Something went wrong. Please try again later.', type: 'error'}) as any)
    });
    request.setDefaultStatusCodeCb(RequestStatusCodes.INTERNAL_SERVER_ERROR,(response:Response) => {
      dispatch(createAlert({message: 'Something went wrong. Please try again later.', type: 'error'}) as any)
    });
    request.setDefaultStatusCodeCb(RequestStatusCodes.BAD_REQUEST,(response:Response) => {
      dispatch(createAlert({message: 'Something went wrong. Please try again later.', type: 'error'}) as any)
    });
    request.setPerRequestStatusCodeCb(paths.auth.verifyEmail, RequestStatusCodes.BAD_REQUEST,(response:responseType) => {
      dispatch(createAlert({
        message: 'Token expidred. Please try again',
        type: 'error'
      }) as any)
    })
    request.setPerRequestStatusCodeCb(paths.auth.signin, RequestStatusCodes.BAD_REQUEST,(response:Response) => {
      dispatch(createAlert({
        message: 'Login or password is incorrect. Please check and try again',
        type: 'error'
      }) as any)
    });

  }, [])

  return (
    <>
      {children}
    </>
  )
}

export default RequestHandler;