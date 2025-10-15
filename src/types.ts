export type ObjValues<T> = T[keyof T];

export type WithClassName<T = unknown> = T & {
    /**
        Extendable classnames of component
    */
    className?: string;
};

export type SetStateValue<T> = React.Dispatch<React.SetStateAction<T>>;
