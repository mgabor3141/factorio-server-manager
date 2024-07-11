import React, {useEffect, useState} from "react";
import savesResource from "../../../../api/resources/saves";
import Select from "../../../components/Select";
import Label from "../../../components/Label";
import {useForm} from "react-hook-form";
import Button from "../../../components/Button";
import modsResource from "../../../../api/resources/mods";

const LoadMods = ({refreshMods}) => {

    const [saves, setSaves] = useState([]);
    const {register, reset, handleSubmit} = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);

    useEffect(() => {
        (async () => {
            const s = await savesResource.list()
            setSaves(s);
            if (s.length > 0) {
                setIsDisabled(false);
            }
            reset();
        })();
    }, []);

    const loadMods = data => {
        setIsLoading(true)
        console.log(data)
        savesResource.mods(data.save)
            .then(({mods}) => {
                modsResource.portal.installMultiple(mods)
                    .then(() => {
                        refreshMods()
                        window.flash(`Mods are loaded from save file ${data.save}.`, "green")
                    })
                    .finally(() => setIsLoading(false))
            })
            .catch(() => setIsLoading(false))
    }

    return (
        <form onSubmit={handleSubmit(loadMods)}>
            <Label text="Save" htmlFor="save"/>
            <Select
                register={register('save')}
                className="mb-4"
                disabled={isDisabled}
                options={saves?.map(save => new Object({
                    name: save.name,
                    value: save.name
                }))}
            />
            <Button isSubmit={true} isDisabled={isDisabled} isLoading={isLoading}>Load</Button>
        </form>
    )
}

export default LoadMods;
