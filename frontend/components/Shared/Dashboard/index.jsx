import { Card, Button, Divider } from "antd";
import {
    DownloadOutlined,
    ManOutlined,
    UploadOutlined,
    BookOutlined
} from "@ant-design/icons";
const Dashboard = () => {
    return (
        <div>
            <div className="grid md:grid-cols-4 gap-6">
                <Card className="shadow">
                    <div className="flex justify-around items-center">
                        <div className="flex items-center flex-col gap-y-2">
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                size="large"
                                shape="circle"
                                className="bg-rose-600"
                            />
                            <h1 className="text-xl font-semibold text-rose-600">
                                Downloads
                            </h1>
                        </div>
                        <Divider type="vertical" className="h-24" />
                        <div>
                            <h1 className="text-5xl font-bold text-rose-400">
                                45K
                            </h1>
                            <p className="text-lg mt-1 text-zinc-400">
                                44,563
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="shadow">
                    <div className="flex justify-around items-center">
                        <div className="flex items-center flex-col gap-y-2">
                            <Button
                                type="primary"
                                icon={<BookOutlined />}
                                size="large"
                                shape="circle"
                                className="bg-green-600"
                            />
                            <h1 className="text-xl font-semibold text-green-600">
                                Books
                            </h1>
                        </div>
                        <Divider type="vertical" className="h-24" />
                        <div>
                            <h1 className="text-5xl font-bold text-green-400">
                                25K
                            </h1>
                            <p className="text-lg mt-1 text-zinc-400">
                                24,563
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="shadow">
                    <div className="flex justify-around items-center">
                        <div className="flex items-center flex-col gap-y-2">
                            <Button
                                type="primary"
                                icon={<ManOutlined />}
                                size="large"
                                shape="circle"
                                className="bg-orange-600"
                            />
                            <h1 className="text-xl font-semibold text-orange-600">
                                Languages
                            </h1>
                        </div>
                        <Divider type="vertical" className="h-24" />
                        <div>
                            <h1 className="text-5xl font-bold text-orange-400">
                                18K
                            </h1>
                            <p className="text-lg mt-1 text-zinc-400">
                                17,563
                            </p>
                        </div>
                    </div>
                </Card>
                <Card className="shadow">
                    <div className="flex justify-around items-center">
                        <div className="flex items-center flex-col gap-y-2">
                            <Button
                                type="primary"
                                icon={<UploadOutlined />}
                                size="large"
                                shape="circle"
                                className="bg-blue-600"
                            />
                            <h1 className="text-xl font-semibold text-blue-600">
                                Uploads
                            </h1>
                        </div>
                        <Divider type="vertical" className="h-24" />
                        <div>
                            <h1 className="text-5xl font-bold text-blue-400">
                                88K
                            </h1>
                            <p className="text-lg mt-1 text-zinc-400">
                                87,563
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
export default Dashboard;