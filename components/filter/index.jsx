import { Select } from 'antd'
import React from 'react'

const Filter = () => {
    const onChange = (value) => {
        console.log(`selected ${value}`);
    }
    return (
        <div className='filter bg-[#DEEEF2] py-3'>
            <div className="container max-w-7xl mx-auto">
                <form className="flex justify-center items-center gap-3">
                    <Select className='min-w-[100px]' onChange={onChange} defaultValue="USD">
                        <Select.Option value="sample" selected>Sample</Select.Option>
                    </Select>
                </form>
            </div>
        </div>
    )
}

export default Filter