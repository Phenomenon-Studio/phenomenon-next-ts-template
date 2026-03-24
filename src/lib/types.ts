export type ObjValues<T> = T[keyof T];

export type WithClassName<T> = T & {
    /**
        Extendable classnames of component
    */
    className?: string;
};

export type SetStateValue<T> = React.Dispatch<React.SetStateAction<T>>;

export type DecodedJWT = {
    sub: string; // User ID (uid)
    email: string;
    iat: number;
    exp: number;
};

export type SvgrIcon = React.FC<React.SVGProps<SVGSVGElement>>;

export type ResponseWithData<TBody = unknown> = {
    data: TBody;
};

export type RequestWithSuccessResponse<TBody = unknown> = {
    success: true;
} & TBody;

export type RequestWithErrorResponse<TBody = unknown> = {
    success: false;
    message: string;
} & TBody;

export type RequestCommonResponse<TResponseBody = unknown, TErrorBody = unknown> =
    | RequestWithSuccessResponse<TResponseBody>
    | RequestWithErrorResponse<TErrorBody>;
