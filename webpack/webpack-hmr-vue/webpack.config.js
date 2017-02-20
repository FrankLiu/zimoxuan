module.exports = {
    entry: __dirname + "/src/main.js",
    output: {
        path: __dirname + "/build",
        filename: "bundle.js"
    },
	module: {
        rules: [
			{test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
            {test: /\.vue$/, exclude: /node_modules/, loader: 'vue-loader'}
        ]
    },
	
	devtool: 'eval-source-map',
	//webpack-dev-server����
    devServer: {
        contentBase: './build',//Ĭ��webpack-dev-server��Ϊ���ļ����ṩ���ط������������Ϊ����һ��Ŀ¼�µ��ļ��ṩ���ط�������Ӧ������������������Ŀ¼���������õ�"build"Ŀ¼��
        historyApiFallback: true,//�ڿ�����ҳӦ��ʱ�ǳ����ã���������HTML5 history API���������Ϊtrue�����е���ת��ָ��index.html
        inline: true,//����Ϊtrue����Դ�ļ��ı�ʱ���Զ�ˢ��ҳ��
        port: 3000,//����Ĭ�ϼ����˿ڣ����ʡ�ԣ�Ĭ��Ϊ"8080"
        stats: true,//��ʾ�ϲ��������
    }
};